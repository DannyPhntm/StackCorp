import ConciergePanel from '../components/Concierge.jsx'

/*
 * /concierge — the front desk.
 *
 * A page rather than a floating launcher, and deliberately not in the nav yet:
 * it is reachable so it can be used and watched for a week before it is
 * advertised. Rollout step 4 in docs/specs/Website Integration.md.
 */
export default function ConciergePage() {
  return <ConciergePanel />
}
