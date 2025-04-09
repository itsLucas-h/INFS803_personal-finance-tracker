import DashboardLayout from "@/layouts/DashboardLayout";

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-gray-600 text-2xl font-bold">Goals</h1>
        <p className="text-gray-600">
          Set and track your financial goals with ease.
        </p>
      </div>
    </DashboardLayout>
  );
}
