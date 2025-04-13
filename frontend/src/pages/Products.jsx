import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
function DashboardHome() {
  return (
    <table>
      <thead>
        <tr>
          <th>Product id</th>
          <th>Product name</th>
          <th>Goods Baked</th>
          <th>Wastage</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-gray-100">
          <td>324</td>
          <td>Still water</td>
          <td>
            <button class="px-2 py-1 bg-blue-100 text-blue-500 rounded hover:bg-blue-200"><FaMinus /></button>
            <input type="number" value="5" class="w-16 text-center mx-2 border border-gray-300 rounded" />
            <button class="px-2 py-1 bg-blue-100 text-blue-500 rounded hover:bg-blue-200"><IoMdAdd /></button>
          </td>
          <td>
            <button class="px-2 py-1 bg-blue-100 text-blue-500 rounded hover:bg-blue-200"><FaMinus /></button>
            <input type="number" value="3" class="w-16 text-center mx-2 border border-gray-300 rounded" />
            <button class="px-2 py-1 bg-blue-100 text-blue-500 rounded hover:bg-blue-200"><IoMdAdd /></button>
          </td>
          <td className="flex items-center justify-center">
            <button class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"><RiDeleteBin6Line /></button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default DashboardHome;
