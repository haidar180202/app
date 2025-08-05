import { Modal, Spinner } from "@cisea/cisea-ui";

export default function CommonLoading({ isLoading }: { isLoading: boolean }) {
  return (
    <Modal
      isOpen={isLoading}
      onClose={() => {}}
      className="text-center"
      width="80px"
    >
      <div className="p-4">
        <Spinner animation="border" />
      </div>
    </Modal>
  );
}
