import React from "react";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";

const SocialSignup = () => {
  const { signInWithGoogle } = useFirebaseAuth();

  return (
    <div className="w-full">
      <div className="my-4 text-gray-500 text-center">or</div>
      <button
        onClick={signInWithGoogle}
        className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition"
      >
        Sign Up with Google
      </button>
    </div>
  );
};

export default SocialSignup;
