import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "../../../firebase.ts";

const LoginPage = () => {
   const handleLoginWithGoogle = async () => {
      const res = await signInWithPopup(auth, googleProvider);
      const idToken = await res.user.getIdToken()
      console.log(idToken);

      
   };

   return (
      <div>
         LoginPage
         <Button onClick={handleLoginWithGoogle}>Login with Google</Button>
      </div>
   );
};

export default LoginPage;
