import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import './scene3d.css'

// Base orientation applied to the loaded model (radians). The GLB's broad
// "front face" (the logo/emblem — the 0.98×0.77 plane) faces ±X in export
// space, so a −Z camera would see only the thin 0.11-wide edge (a blade). We
// rotate ~90° around Y to turn that face toward the camera, holding back a
// little from a dead-on 90° for a slight, premium 3/4 angle.
const MODEL_ROT = { x: 0, y: -1.42, z: 0.05 }

/*
 * Scene3D — the StackCorp 3D stack as the site's main character.
 *
 * A fixed, transparent WebGL canvas behind all page content. Loads
 * public/model/stackcorp-logo.glb. The current model is a single textured PBR
 * mesh (no named layers, no baked animation) — its own materials are preserved
 * and a base orientation (MODEL_ROT) stands it upright at a premium 3/4 angle.
 * (The earlier starter model — 12 named meshes: three layers, blue-light
 * emitters, a glowing core — is still handled: its accent meshes are made
 * emissive and its layers are collected for the spread animation.) Cinematic
 * lighting: soft ambient + a key light + a blue rim light, over a generated
 * room-environment map for premium metal reflections. Glow comes from the CSS
 * bed behind the canvas — no post-processing bloom, so the canvas stays
 * transparent and cheap.
 *
 * `onReady({ camera, model, layers, lookTarget, group, THREE })` hands these to
 * the parent so GSAP ScrollTrigger can pose the camera (+ spread the layers if
 * the model has any, else a gentle model turn drives the unfold). The render
 * loop runs continuously, so GSAP mutations are picked up each frame.
 *
 * Idle float + mouse parallax are disabled for reduced-motion and coarse
 * pointers. Everything is disposed on unmount.
 */
export default function Scene3D({ onReady, onError }) {
  const mountRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? false
    const parallaxOn = finePointer && !reduce
    const isMobile = window.matchMedia?.('(max-width: 760px)').matches ?? false

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      36,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    // Hero pose: front-facing with a gentle elevation so the stack's face
    // (chevrons + blue core) reads with real depth — a head-on/low angle catches
    // the thin edge and looks flat. Desktop pans the camera left (camera.x ===
    // lookTarget.x below) so the model slides right-of-centre while staying
    // front-on, leaving the left-hand copy clear; mobile centres the model but
    // raises it into the upper half (camera pulled back) so it never overlaps the
    // bottom-anchored copy. GSAP retargets camera.position + lookTarget on scroll
    // (Home.jsx pose 2 animates *from* exactly these values).
    //
    // Desktop: pan the camera left AND up in lock-step with the look target
    // (camera.x === lookTarget.x; camera.y === lookTarget.y + elevation) so the
    // model slides right-of-centre and a touch lower while its front-on angle is
    // preserved — panning (not re-aiming) avoids tilting the view into a top-down
    // 3/4 that reads less like the logo face.
    camera.position.set(isMobile ? 0 : -1.15, isMobile ? 0.5 : 0.85, isMobile ? 7.1 : 5.6)
    const lookTarget = new THREE.Vector3(isMobile ? 0 : -1.15, isMobile ? -1.05 : 0.45, 0)
    camera.lookAt(lookTarget)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0) // transparent
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    mount.appendChild(renderer.domElement)

    // Premium reflections without an HDR asset.
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    // ---- Cinematic lighting ----
    // Lower ambient (deeper shadows) + a stronger steel-blue rim so the model
    // reads rich and three-dimensional against the darker background rather
    // than flat. A soft blue fill lifts the shadow side just enough.
    scene.add(new THREE.AmbientLight(0x28384a, 0.52))
    const key = new THREE.DirectionalLight(0xffffff, 2.6)
    key.position.set(3.5, 5, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x3f7bff, 4.0) // steel-blue rim
    rim.position.set(-4.5, 1.2, -3.8)
    scene.add(rim)
    const fill = new THREE.PointLight(0x4a7fd6, 0.55, 20)
    fill.position.set(0, -1.5, 3)
    scene.add(fill)

    // Group wraps the model so parallax/float never fight GSAP pose transforms
    // (GSAP drives the model; parallax drives the group).
    const group = new THREE.Group()
    scene.add(group)

    let model = null
    const layers = []
    let raf = 0
    let disposed = false
    const startTime = performance.now()

    // Pointer parallax target (damped toward these each frame).
    const pointer = { x: 0, y: 0 }
    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (parallaxOn) window.addEventListener('pointermove', onPointerMove, { passive: true })

    const loader = new GLTFLoader()
    loader.load(
      '/model/stackcorp-logo.glb',
      (gltf) => {
        if (disposed) return
        model = gltf.scene

        // Base orientation for the GLB (stand the stack upright at a premium
        // 3/4 angle), then centre + scale from the *rotated* bounds so it sits
        // dead-centre regardless of the model's export units/orientation.
        model.rotation.set(MODEL_ROT.x, MODEL_ROT.y, MODEL_ROT.z)
        model.updateMatrixWorld(true)
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        model.position.sub(center)
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const targetSize = 2.5
        model.scale.setScalar(targetSize / maxDim)

        model.traverse((o) => {
          if (!o.isMesh) return
          const name = o.name.toLowerCase()
          const mat = o.material
          if (!mat) return
          // A real textured GLB (the StackCorp model) brings its own PBR
          // materials — preserve them; just give reflections some life.
          const textured = !!(mat.map || mat.normalMap || mat.roughnessMap || mat.metalnessMap)
          if (name.includes('blue_light') || name.includes('inner_blue_core')) {
            // Starter model's self-illuminated accent meshes.
            mat.emissive = new THREE.Color(0x2f6df0)
            mat.emissiveIntensity = name.includes('core') ? 2.0 : 1.3
            mat.color = new THREE.Color(0x3f7bff)
            mat.metalness = 0.2
            mat.roughness = 0.25
            mat.toneMapped = false
          } else if (textured) {
            mat.envMapIntensity = 1.15
          } else {
            // Starter model's untextured panels: dark brushed metal.
            mat.metalness = 0.62
            mat.roughness = 0.38
            if (name.includes('layer')) layers.push(o)
          }
          mat.needsUpdate = true
        })

        // Bottom→top layer order so "opening" separates predictably (starter
        // model only; the new single-mesh model has no layers — the scroll
        // uses camera + rotation instead, handled in Home).
        layers.sort((a, b) => a.position.y - b.position.y)

        group.add(model)
        setLoaded(true)
        onReady?.({ camera, model, layers, group, lookTarget, renderer, scene, THREE })
        if (reduce) renderFrame() // static path: draw the single settled frame
      },
      (evt) => {
        if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100))
      },
      () => {
        if (!disposed) {
          setFailed(true)
          onError?.()
        }
      },
    )

    const renderFrame = () => {
      const t = (performance.now() - startTime) / 1000
      if (model && !reduce) {
        // Calm idle float — never a spin.
        group.position.y = Math.sin(t * 0.9) * 0.06
      }
      if (parallaxOn && model) {
        // Damped parallax: the group leans slightly toward the cursor.
        group.rotation.y += (pointer.x * 0.18 - group.rotation.y) * 0.05
        group.rotation.x += (-pointer.y * 0.12 - group.rotation.x) * 0.05
      }
      // Keep the camera aimed at the (GSAP-driven) look target every frame.
      camera.lookAt(lookTarget)
      renderer.render(scene, camera)
    }

    // Continuous loop only when motion is on. It pauses when the tab is hidden
    // (no GPU work on background tabs). Reduced-motion skips the loop entirely
    // and renders single frames on load/resize (nothing animates, so there's
    // nothing to loop for).
    const loop = () => {
      raf = requestAnimationFrame(loop)
      renderFrame()
    }
    const startLoop = () => {
      if (!raf && !reduce) loop()
    }
    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else if (reduce) renderFrame()
      else startLoop()
    }
    document.addEventListener('visibilitychange', onVisibility)
    startLoop()

    // Debounced: mobile URL-bar show/hide fires resize on scroll; reallocating
    // the drawing buffer mid-scroll is a jank source.
    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!mount) return
        const w = mount.clientWidth
        const h = mount.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        if (reduce) renderFrame()
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      if (parallaxOn) window.removeEventListener('pointermove', onPointerMove)
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose?.()
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.())
          else o.material?.dispose?.()
        }
      })
      pmrem.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [onReady, onError])

  return (
    <div className="scene3d" aria-hidden="true">
      <div className="scene3d-canvas" ref={mountRef} />
      {!loaded && !failed && (
        <div className="scene3d-loader">
          <div className="scene3d-loader-mark" />
          <div className="scene3d-loader-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>Loading StackCorp…</p>
        </div>
      )}
    </div>
  )
}
