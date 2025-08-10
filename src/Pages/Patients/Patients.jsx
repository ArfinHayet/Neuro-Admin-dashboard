
import UsersList from "../../Components/Patients/UsersList";
import UserStats from "../../Components/Patients/UserStats";

const PatientPage = () => {
  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 ">
      <h1 className="font-medium text-3xl mb-8">Users List</h1>
      <UserStats />
      <UsersList />
    </section>
  );
};

export default PatientPage;
