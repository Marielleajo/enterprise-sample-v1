import Swal from "sweetalert2";

const swalGeneralFunction = async (titleText, descriptionText) => {
  const result = await Swal.fire({
    title: titleText,
    text: descriptionText,
    showCancelButton: true,
    cancelButtonColor: "#dd3333",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  });

  return result;
};

export default swalGeneralFunction;
