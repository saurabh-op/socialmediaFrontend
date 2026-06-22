import "./noChatSelected.css";
import { Plus, MessagesSquare, MSquareIcon } from "lucide-react";

function NoChatSelected() {
  return (
    <div className="ncs_wrapper">
      {/* Background blobs */}
      <div className="ncs_blob1"></div>
      <div className="ncs_blob2"></div>
      <div className="ncs_blob3"></div>
      <div className="ncs_blob4"></div>
      <div className="ncs_blob5"></div>
      <div className="ncs_blob6"></div>

      <div className="ncs_container">
        <div className="ncs_icon">
          <MessagesSquare size={70} strokeWidth={2.2} />
        </div>

        <h1 className="ncs_heading">Select a conversation</h1>

        <p className="ncs_instruction">
          Choose someone from your messages on the left to start chatting
        </p>
      </div>
    </div>
  );
}

export default NoChatSelected;
