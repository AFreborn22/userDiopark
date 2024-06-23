import { useEffect, useState } from "react";
import moment from 'moment';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const getTransactions = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const transResponse = await fetch(
        "https://dioparkapp-production.up.railway.app/api/transaksi/riwayat-transaksi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!transResponse.ok) {
        setIsAuthenticated(false);
        return;
      }

      const transData = await transResponse.json();
      setTransactions(transData);
    } catch (error) {
      console.error("Error fetching history transactions data", error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="flex items-center justify-center text-4xl font-bold text-gray-800 mb-8">Riwayat</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kendaraan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nomor Polisi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Waktu
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.data &&
                transactions.data.map((transaction) => (
                  <tr key={transaction.waktu_parkir}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.pengguna.nama}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.pengguna.detail_kendaraan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.pengguna.nomor_polisi}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(transaction.waktu_parkir).format('YYYY MMMM DD, HH:mm:ss')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === "masuk"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
