import { Button, ButtonProps } from "@/ui/Button";
import { ImageWithFallback } from "@/ui/ImageWithFallback";

interface ProfileProps {
  name: string;
  picture?: string;
  logoutBtnProps?: ButtonProps;
}

export const Profile: React.FC<ProfileProps> = ({
  name,
  picture,
  logoutBtnProps,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px] w-2/3">
        <ImageWithFallback
          src={picture}
          fallbackSrc="/images/default_profile.jpg"
          alt="profile"
          className="w-[32px] h-[32px] rounded-full"
        />

        <p className="font-medium truncate w-full">{name}</p>
      </div>

      <Button
        variant="danger"
        className="w-[80px] h-[32px]"
        {...logoutBtnProps}
      >
        Logout
      </Button>
    </div>
  );
};
