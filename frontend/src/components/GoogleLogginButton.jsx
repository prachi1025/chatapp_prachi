export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <button
      className="btn btn-outline btn-primary w-full"
      onClick={handleGoogleLogin}
    >
      Sign in with Google
    </button>
  );
}
