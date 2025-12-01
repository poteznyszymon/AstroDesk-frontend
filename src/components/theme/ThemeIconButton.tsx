import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "./theme-provider";

interface ThemeIconButtonProps {
  className?: string;
}

const ThemeIconButton = ({ className }: ThemeIconButtonProps) => {
  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      className={className}
      size={"icon-sm"}
      variant={"ghost"}
      onClick={changeTheme}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeIconButton;
