export default function Error({ statusCode }) {
  return (
    <div className="items-center self-center flex flex-col mb-6 mt-12 mx-6 my-auto overflow-hidden w-full">
      <span className="sm:text-2xl md:text-2xl">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </span>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
