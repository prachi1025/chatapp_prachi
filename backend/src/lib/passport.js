import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          profilePic: profile.photos[0].value
        };
        return done(null, userData);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Export passport instance
export default passport;
