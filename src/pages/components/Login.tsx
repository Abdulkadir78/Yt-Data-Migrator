import { useGoogleLogin } from "@react-oauth/google";

import { useAuth } from "../contexts/Auth";
import { Button } from "@/ui/Button";

export const Login: React.FC<{ type?: "source" | "destination" }> = ({
  type = "source",
}) => {
  const { updateSourceToken, updateDestinationToken } = useAuth();

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube",
    onSuccess: (response) => {
      if (type === "source") {
        updateSourceToken(response.access_token);
      } else {
        updateDestinationToken(response.access_token);
      }
    },
  });

  return (
    <Button onClick={() => login()} className="w-[160px] lg:w-[180px]">
      Login with Google
    </Button>
  );
};
