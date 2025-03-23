
// This is a compatibility layer that imports and re-exports the refactored component
import { UserProfileSidebarFooter as RefactoredFooter } from "./profile-sidebar/UserProfileSidebarFooter";

export function UserProfileSidebarFooter() {
  return <RefactoredFooter />;
}
