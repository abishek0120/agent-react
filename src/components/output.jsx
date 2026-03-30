const Output = ({ output }) => {
  if (!output) {
    return (
      <div className="text-sm text-gray-500">
        Waiting for final result...
      </div>
    );
  }

  return (
    <div className="bg-green-900/40 p-4 rounded border border-green-700">

      <h2 className="font-semibold mb-2">
        Final Output
      </h2>

      <p className="text-sm leading-relaxed">
        {output}
      </p>

    </div>
  );
};

export default Output;