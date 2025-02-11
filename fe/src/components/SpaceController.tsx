import { useParams } from "react-router-dom";

const SpaceController = () => {
   const { spaceId } = useParams();

   return <div className="w-full p-10">{spaceId}</div>;
};

export default SpaceController;
