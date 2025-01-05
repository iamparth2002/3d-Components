import ChimneyViewer from '@/components/ChimneyViewer';

export default function Page() {
  return (
    <>
      <h2 className="text-2xl font-semibold p-4 absolute">
        Heat Exchanger Detailed View
      </h2>
      <ChimneyViewer />
    </>
  );
}
