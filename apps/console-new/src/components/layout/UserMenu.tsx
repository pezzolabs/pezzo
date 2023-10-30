import {
  GraduationCap,
  HelpCircle,
  InfoIcon,
  LogOutIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@pezzo/ui";
import { useAuthContext } from "~/lib/providers/AuthProvider";
import { Link } from "react-router-dom";
import { Avatar } from "../common/Avatar";

export const UserMenu = () => {
  const { currentUser } = useAuthContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <li className="px-4 mb-2 mt-auto flex h-full cursor-pointer items-center rounded-md p-2 text-sm font-medium text-stone-400 transition-all hover:bg-gray-900 hover:text-white ">
          <Avatar user={currentUser} className="h-8 w-8" />
          <span className="ml-2">{currentUser?.name}</span>
        </li>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="https://docs.pezzo.ai" target="_blank">
          <DropdownMenuItem>
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/logout">
          <DropdownMenuItem>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
