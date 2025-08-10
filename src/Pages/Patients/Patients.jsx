
import UsersList from "../../Components/Patients/UsersList";
import UserStats from "../../Components/Patients/UserStats";

const PatientPage = () => {
  return (
    <section className="h-[90vh] overflow-y-auto bg-[#F6F7F9] rounded-3xl  px-6 pt-5 ">
      <h1 className="font-medium text-2xl mb-4">Users List</h1>
      <UsersList />
    </section>
  );
};

export default PatientPage;
