const Header = ({ run, time }) => {
  return (
    <div className="flex justify-between items-center">

      <div>
        <h1 className="text-lg font-semibold">{run.query}</h1>
        <p className="text-sm text-gray-400">
          Status: {run.status}
        </p>
      </div>

      <div className="text-sm text-gray-400">
        ⏱ {time}s
      </div>

    </div>
  );
};

export default Header;