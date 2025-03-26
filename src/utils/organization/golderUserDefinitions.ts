
import { UserRoleType } from "@/types/database";

export interface UserToCreate {
  firstName: string;
  lastName: string;
  saId: string;
  email: string;
  role: UserRoleType;
  jobTitle: string;
}

/**
 * Predefined user data for Golder organization
 */
export const golderUsers: UserToCreate[] = [
  {
    firstName: 'Bongani',
    lastName: 'Khumalo',
    saId: '9001075800087',
    email: 'bongani.khumalo@golder.co.za',
    role: 'user',
    jobTitle: 'Researcher'
  },
  {
    firstName: 'Lesego',
    lastName: 'Motaung',
    saId: '9209015800084',
    email: 'lesego.motaung@golder.co.za',
    role: 'user',
    jobTitle: 'Metoerologist'
  },
  {
    firstName: 'Lindiwe',
    lastName: 'Mbatha',
    saId: '8711120800188',
    email: 'lindiwe.mbatha@golder.co.za',
    role: 'user',
    jobTitle: 'Mining Engineer'
  },
  {
    firstName: 'Mandla',
    lastName: 'Tshabalala',
    saId: '8908075800086',
    email: 'mandla.tshabalala@golder.co.za',
    role: 'comm_moderator',
    jobTitle: 'Mining Executive'
  },
  {
    firstName: 'Nomvula',
    lastName: 'Dlamini',
    saId: '9012120800185',
    email: 'nomvula.dlamini@golder.co.za',
    role: 'user',
    jobTitle: 'Chief Executive'
  },
  {
    firstName: 'Precious',
    lastName: 'Mokoena',
    saId: '9105120800187',
    email: 'precious.mokoena@golder.co.za',
    role: 'hr_moderator',
    jobTitle: 'HR Executive'
  },
  {
    firstName: 'Sipho',
    lastName: 'Mabaso',
    saId: '8703075800083',
    email: 'sipho.mabaso@golder.co.za',
    role: 'user',
    jobTitle: 'Revenue Executive'
  },
  {
    firstName: 'Thabo',
    lastName: 'Nkosi',
    saId: '8801015800082',
    email: 'thabo.nkosi@golder.co.za',
    role: 'org_admin',
    jobTitle: 'Chief Information Officer'
  },
  {
    firstName: 'Themba',
    lastName: 'Zulu',
    saId: '8504075800085',
    email: 'themba.zulu@golder.co.za',
    role: 'user',
    jobTitle: 'IT Support Manager'
  },
  {
    firstName: 'Zanele',
    lastName: 'Ndlovu',
    saId: '8606120800186',
    email: 'zanele.ndlovu@golder.co.za',
    role: 'org_admin',
    jobTitle: 'Chief Operations Officer'
  }
];
