import Swal from "sweetalert2";

const swalDeleteFunction = async (
  descriptionText = "Are you sure you want to delete?"
) => {
  const result = await Swal.fire({
    title: "Delete",
    text: descriptionText,
    showCancelButton: true,
    cancelButtonColor: "#dd3333",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  });

  return result;
};

export default swalDeleteFunction;
