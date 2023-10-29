import {
  ArrowRightLeft,
  Building,
  KeyRoundIcon,
  LogOutIcon,
  Plus,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@pezzo/ui";
import { useAuthContext } from "~/lib/providers/AuthProvider";
import { useCurrentOrganization } from "~/lib/hooks/useCurrentOrganization";
import { useOrganizations } from "~/lib/hooks/useOrganizations";
import { useNavigate } from "react-router-dom";

type Props = {
  collapsed: boolean;
};

export const SettingsMenu = ({ collapsed }: Props) => {
  const { currentUser } = useAuthContext();
  const { organization } = useCurrentOrganization();
  const { organizations } = useOrganizations();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <li className="mb-2 mt-auto flex cursor-pointer items-center rounded-md p-2 text-sm font-medium text-stone-400 transition-all hover:bg-gray-800 hover:text-white ">
          <SettingsIcon className="h-5 w-5 shrink-0" aria-hidden="true" />

          <motion.div
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{
              width: collapsed ? 0 : "auto",
              opacity: collapsed ? 0 : 1,
              marginLeft: collapsed ? 0 : 10,
            }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
          >
            Settings
          </motion.div>
        </li>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end" forceMount>
        {organization && (
          <DropdownMenuSub>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                <p className="text-sm font-medium leading-none">
                  {organization.name}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSubTrigger>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              <span>Change organization</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuItem onClick={() => navigate(`/orgs/${organization.id}/members`)}>
              <UsersIcon className="mr-2 h-4 w-4" />
              <span>Members</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/orgs/${organization.id}/api-keys`)}>
              <KeyRoundIcon className="mr-2 h-4 w-4" />
              <span>API keys</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/orgs/${organization.id}/settings`)}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {organizations
                  .filter((org) => org.id !== organization.id)
                  .map((org) => (
                    <DropdownMenuItem key={org.id}>
                      <Building className="mr-2 h-4 w-4" />
                      <span>{org.name}</span>
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuItem disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create new</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}
        <DropdownMenuSeparator />
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
        <DropdownMenuItem>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
