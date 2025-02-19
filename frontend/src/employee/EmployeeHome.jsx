import { useTheme } from "../context/ThemeContext";
import EmployeeNavbar from "./EmployeeNavbar";

const EmployeeHome = () => {
  const { theme } = useTheme();

  return (
    <div>
      <EmployeeNavbar />
      <h2>Welcome Employee</h2>
      <p>This is a simple home page for testing.</p>
    </div>
  );
};

export default EmployeeHome;
