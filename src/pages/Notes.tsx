
import { withMainLayout } from '@/layouts/MainLayout';
import { NotesPage } from '@/components/notes/NotesPage';

function Notes() {
  return <NotesPage />;
}

export default withMainLayout(Notes);
