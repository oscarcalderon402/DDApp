import React, { useState, useEffect, useContext, useCallback } from "react";
import DatePicker from "react-datepicker";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { format } from "date-fns";
import { useOktaAuth } from "@okta/okta-react";
import { GlobalContext } from "../../context/GlobalState";
import axios from "axios";
import { v4 } from "uuid";
//import "bootstrap/dist/css/bootstrap.min.css";
import { useDropzone } from "react-dropzone";

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: "100%",
  height: "auto",
  maxHeight: "600px",
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const ModalAddCase = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [payments, setPayments] = useState("");
  const [installment, setInstallment] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [verifiedDate, setVerifiedDate] = useState(null);
  const [appliedDate, setAppliedDate] = useState(null);
  const [verified, setVerified] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState();
  const [fileToSend, setFileToSend] = useState(null);
  const [imageRecivied, setImageRecivied] = useState();
  const [preview, setPreview] = useState([]);
  const [test, setTest] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    var reader = new FileReader();
    setPreview(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    // const newFile = { ...acceptedFiles[0], name: };

    // console.log(acceptedFiles[0]);
    // console.log(newFile);
    setFileToSend(acceptedFiles[0]);
    reader.readAsBinaryString(acceptedFiles[0]);

    reader.onload = function () {
      setFile(btoa(reader.result));
    };
    reader.onerror = function () {
      console.log("there are some problems");
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const thumbs = preview.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  const {
    isOpenModal,
    TempCase,
    openModal,
    addCase,
    updateCase,
    deleteTempCase,
  } = useContext(GlobalContext);

  const { authState } = useOktaAuth();
  const role = authState.accessToken.claims.role;

  useEffect(() => {
    if (TempCase && TempCase.length) {
      const {
        name,
        userId,
        amount,
        number_payments,
        code,
        installment,
        time,
        status,
        verifided_date,
        applied_date,
        reviewed,
        image,
      } = TempCase[0];

      const hours = time.slice(0, 2);
      const minutes = time.slice(3, 5);
      const date = new Date(1993, 10, 1, hours, minutes);

      if (role === "overdue") {
        setName(name);
        setPayments(number_payments);
        setInstallment(installment.toString());
        setAmount(amount);
        setStartDate(date);
        setUserId(userId);
        setImageRecivied(image);
      } else {
        setCode(code);
        setStatus(status);
        setVerifiedDate(verifided_date);
        setAppliedDate(applied_date);
        setVerified(reviewed);
      }
    }
  }, [TempCase, role]);

  const onSubmit = async (e) => {
    e.preventDefault();

    ///validation
    if (role && role === "contable" && code === "") {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, [2000]);
      return;
    }

    if (role === "overdue") {
      //no puede enviar campos vacios
      if (
        name?.toString().trim() === "" ||
        userId?.toString().trim() === "" ||
        payments?.toString().trim() === "" ||
        installment?.toString().trim() === "" ||
        amount?.toString().trim() === ""
      ) {
        setError(true);
        setMessage("No puede enviar campos vacios");
        setTimeout(() => {
          setError(false);
        }, [2000]);
        return;
      }

      //verificar si se envia imagen
      if (!fileToSend && !imageRecivied) {
        setError(true);
        setMessage("Anexe una imagen por favor");
        setTimeout(() => {
          setError(false);
        }, [2000]);
        return;
      }

      //verificar que el numero de pagos sea igual a cantidad de cuotas
      if (payments != installment?.split(",")?.length) {
        setError(true);
        setMessage(
          "El numero en payments debe ser igual a la cantidad de digitos en installment"
        );
        setTimeout(() => {
          setError(false);
        }, [2000]);
        return;
      }
      //separar por comas
    }

    if (TempCase.length && TempCase[0]?._id && role && role === "overdue") {
      updateCase({
        ...TempCase[0],
        name: name,
        userId: userId,
        amount: amount,
        number_payments: payments,
        code: code,
        installment: installment.split(","),
        time: format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
          .toString()
          .slice(11, 16),
      });
    } else if (
      TempCase.length &&
      TempCase[0]?._id &&
      role &&
      role === "contable"
    ) {
      updateCase(
        !verifiedDate
          ? {
              ...TempCase[0],
              status: status,
              code: code,
              verifided_date: new Date(),
            }
          : {
              ...TempCase[0],
              status: status,
              code: code,
            }
      );
    } else if (
      TempCase.length &&
      TempCase[0]?._id &&
      role &&
      role === "admin"
    ) {
      updateCase(
        !appliedDate
          ? {
              ...TempCase[0],
              status: status,
              reviewed: verified,
              applied_date: new Date(),
            }
          : {
              ...TempCase[0],
              status: status,
              reviewed: verified,
            }
      );
    } else {
      addCase(
        {
          name: name,
          userId: userId,
          amount: amount,
          number_payments: payments,
          code: code,
          installment: installment.split(","),
          time: format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
            .toString()
            .slice(11, 16),
          image: fileToSend.name,
        },
        fileToSend
      );
    }

    console.log("enviado");
    openModal(false);
    deleteTempCase();
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    console.log(e);
    return;
  };

  const handleChange = (e) => {
    setVerified(e.target.checked);
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    if (imageRecivied !== "") {
      async function test() {
        const response = await axios.get(
          `http://localhost:5000/api/cases/image/${imageRecivied}`
        );

        if (response) {
          setTest(`http://localhost:5000/api/cases/image/${imageRecivied}`);
          setFileToSend({});
        }
      }
      test();
    }
  }, [imageRecivied]);

  return (
    <Modal
      show={isOpenModal}
      //onRequestClose={() => setIsOpenModal(false)}
      onHide={() => {
        openModal(false);
        deleteTempCase();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      // backdrop="static"
      // keyboard={false}
      centered
    >
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {role === "overdue"
              ? TempCase?.length && TempCase[0]?._id
                ? "Edit Case"
                : "Add Case"
              : role === "contable"
              ? "Add Code and Status"
              : "Add Status and Check"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {role === "overdue" && (
            <>
              {error === true && (
                <p className="alert alert-danger">{message}</p>
              )}
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Oscar Calderon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>UserId</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="21dasrw"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Payments</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="3"
                  value={payments}
                  onChange={(e) => setPayments(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Installment</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1,3,5"
                  value={installment}
                  onChange={(e) => setInstallment(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="250"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="d-flex flex-column mb-3">
                <Form.Label style={{ display: "block" }}>Time</Form.Label>

                <DatePicker
                  className="form-control"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={10}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  pick12HourFormat="false"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                {/* <form>
                  <input type="file" name="image" />
                  <input type="submit" />
                </form> */}
                {/* <button>Save</button> */}
              </Form.Group>
            </>
          )}
          {role === "contable" && (
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error === true && (
                <p className="mt-3 ml-5 text-danger">
                  Por favor ingrese el code
                </p>
              )}
            </Form.Group>
          )}
          {role === "contable" || role === "admin" ? (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <select
                className="form-control"
                onChange={(event) => setStatus(event.target.value)}
              >
                {" "}
                {role !== "admin" && (
                  <option
                    value="pending"
                    selected={status === "pending" ? true : null}
                  >
                    pending
                  </option>
                )}
                <option
                  value="confirmed"
                  selected={status === "confirmed" ? true : null}
                >
                  confirmed
                </option>
                {role === "admin" && (
                  <option
                    value="applied"
                    selected={status === "applied" ? true : null}
                  >
                    applied
                  </option>
                )}
              </select>
            </Form.Group>
          ) : null}
          {role === "admin" && (
            <Form.Group className="mb-3">
              <Form.Label>Verified</Form.Label>
              <Form.Check
                type="checkbox"
                aria-label="radio 1"
                label="active"
                onChange={handleChange}
                checked={verified === true ? true : false}
              />
            </Form.Group>
          )}
          {!fileToSend ? (
            <div
              style={{
                height: "400px",
                border: "2px dashed #b5b5b5",
                fontSize: "2.8rem",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop the image, or click to select file</p>
              )}
            </div>
          ) : (
            <>
              {!imageRecivied && thumbs}
              {imageRecivied && (
                <img
                  src={test}
                  className="d-block"
                  style={{ width: "400px", height: "400px" }}
                />
              )}

              <div
                className="btn btn-danger mt-2"
                onClick={() => {
                  setPreview([]);
                  setFileToSend(null);
                  setImageRecivied(false);
                }}
              >
                delete
              </div>
            </>
          )}
          {imageRecivied && role !== "overdue" && (
            <img src={test} width="500" height="600" />
          )}
          {/* <div>
            <input type="file" name="file" onChange={fileSelected} />
          </div> */}
        </Modal.Body>
        <Modal.Footer className="mb-2">
          <Button type="submit">Send</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalAddCase;
