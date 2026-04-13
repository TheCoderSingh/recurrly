<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Recurrly, an Expo (React Native) subscription management app using Clerk for authentication.

## Summary of changes

- **Installed** `posthog-react-native` and `react-native-svg` (required peer dependency)
- **Created** `app.config.js` to expose PostHog credentials via `Constants.expoConfig.extra`
- **Created** `src/config/posthog.ts` — PostHog client singleton with batching, feature flags, and lifecycle event capture configured
- **Updated** `app/_layout.tsx` — wrapped the app in `PostHogProvider` with autocapture (touches) and manual screen tracking via `posthog.screen()` on every route change
- **Updated** `app/(auth)/sign-in.tsx` — `posthog.identify()` + `user_signed_in` on successful login (password and MFA paths); `user_sign_in_failed` on errors; `mfa_verification_started` when MFA flow begins
- **Updated** `app/(auth)/sign-up.tsx` — `posthog.identify()` + `user_signed_up` (with `signup_date` set-once property) on email verification completion; `user_sign_up_failed` on any error
- **Updated** `app/(tabs)/settings.tsx` — `user_signed_out` captured and `posthog.reset()` called before Clerk sign-out
- **Updated** `app/(tabs)/index.tsx` — `subscription_card_expanded` captured when user expands a subscription card
- **Updated** `app/subscriptions/[id].tsx` — `subscription_details_viewed` captured on mount
- **Set** `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env` (values never hardcoded in source)

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User completes sign-in (password or MFA) | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | Sign-in attempt fails | `app/(auth)/sign-in.tsx` |
| `mfa_verification_started` | MFA/client-trust flow triggered after password auth | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User completes email verification and finishes sign-up | `app/(auth)/sign-up.tsx` |
| `user_sign_up_failed` | Sign-up attempt fails at any stage | `app/(auth)/sign-up.tsx` |
| `subscription_card_expanded` | User expands a subscription card on the home screen | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User views the subscription details screen | `app/subscriptions/[id].tsx` |
| `user_signed_out` | User taps Sign out in settings | `app/(tabs)/settings.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/379592/dashboard/1459392
- **Sign-ups & Sign-ins Over Time**: https://us.posthog.com/project/379592/insights/MxQnU0DB
- **Sign-up to Sign-in Conversion Funnel**: https://us.posthog.com/project/379592/insights/GAkiFKV0
- **Auth Failure Rate**: https://us.posthog.com/project/379592/insights/sQlRpxGM
- **Subscription Engagement**: https://us.posthog.com/project/379592/insights/4P4vQb5F
- **User Sign-outs (Churn Signal)**: https://us.posthog.com/project/379592/insights/l2DNV2wu

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
