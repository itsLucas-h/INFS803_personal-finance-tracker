import DashboardLayout from "@/layouts/DashboardLayout";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-gray-600 text-2xl font-bold">Reports</h1>
        <p className="text-gray-600">
          Visualize your spending and income trends with detailed reports.
        </p>
      </div>
    </DashboardLayout>
  );
}
