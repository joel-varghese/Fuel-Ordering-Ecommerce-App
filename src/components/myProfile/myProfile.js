import React, { useState } from "react";
import image from "./../../assets/images/Banner_img.png";
import profile_picture from "./../../assets/images/Profile_Pic.jpg";
import { FiEdit2 } from "react-icons/fi";
import { IconContext } from "react-icons";
import Tooltip from "react-bootstrap/Tooltip";
import "./myProfile.scss";
import { OverlayTrigger } from "react-bootstrap";
import iIcon from "../../assets/images/info-icon.png";
import CustomModal from "../customModal/customModal";
const MyProfile = () => {
  const [enableEditing, setEnableEditing] = useState(false);
  const renderTooltip = (tooltipInfo) => (
    <Tooltip id="button-tooltip" {...tooltipInfo}>
      {tooltipInfo.text}
    </Tooltip>
  );
  const overLayTooltip = (Tooltiptext) => {
    return (
      <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip({ text: Tooltiptext })}
        text={Tooltiptext}
      >
        <img src={iIcon} tabIndex="0" alt="Tooltip icon" />
      </OverlayTrigger>
    );
  };

  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <div
      className={`container card p-0 rounded-0 pb-5 mb-5  ${
        (open || openMobile) ? "bf-show-model-blr" : ""
      }`}
    >
      <CustomModal
        show={open}
        onHide={() => {
          setOpen(false);
        }}
        modelBodyContent={
          <div style={{padding: '10px 30px'}}>
            <div className="col d-flex align-items-center">
              <h6 className="text-nowrap">Enter New Email</h6>
              <hr className="postTitleLine ms-3" />
            </div>
            <div className="col d-flex align-items-center" style={{gap: 20}}>
            <input
              type="email"
              className="form-control"
              placeholder="Enter new email address"
            />
            <button className="validateEmail" style={{padding: '5px 35px', background: '#051B2E',color: '#FFFFFF'}}>VALIDATE</button>
            </div>
          </div>
        }
        //buttonText={fboEnrollData.modal[0].submitModal.primaryButton.text}
      />

<CustomModal
        show={openMobile}
        onHide={() => {
          setOpenMobile(false);
        }}
        modelBodyContent={
          <div style={{padding: '10px 30px'}}>
            <div className="col d-flex align-items-center">
              <h6 className="text-nowrap">Enter Mobile Number</h6>
              <hr className="postTitleLine ms-3" />
            </div>
            <div className="col d-flex align-items-center" style={{gap: 20}}>
            <input
              type="phone"
              className="form-control"
              placeholder="Enter new mobile number"
            />
            <button className="validateEmail" style={{padding: '5px 35px', background: '#051B2E',color: '#FFFFFF'}}>VALIDATE</button>
            </div>
          </div>
        }
        //buttonText={fboEnrollData.modal[0].submitModal.primaryButton.text}
      />
      <div className="position-relative">
        <img src={image} alt="" className="w-100" />
        <div
          className="position-absolute top-0 end-0 bg-dark py-1 px-3 text-white"
          role="button"
          style={{ fontSize: "12px" }}
        >
          Edit
          <IconContext.Provider
            value={{
              color: "#FFFFFF",
              size: "10px",
              className: "global-class-name",
            }}
          >
            <FiEdit2 className="ms-1 mb-1" />
          </IconContext.Provider>
        </div>
        <div
          className="position-absolute bottom-0 ms-3 mb-3 rounded-circle overflow-hidden"
          style={{ width: "120px", height: "120px" }}
        >
          <img src={profile_picture} alt="" className=" w-100" />
          <div
            className="position-absolute bottom-0 w-100 text-center bg-dark py-1 px-2 text-white"
            role="button"
            style={{ fontSize: "10px" }}
          >
            Edit
            <IconContext.Provider
              value={{
                color: "#FFFFFF",
                size: "8px",
                className: "global-class-name",
              }}
            >
              <FiEdit2 className="ms-1 mb-1" />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div className="container py-3 px-3">
        <div className="row w-100 justify-content-between">
          <div className="col d-flex align-items-center">
            <h4>Profile</h4>
            <hr className="postTitleLine ms-2" />
          </div>
          <div className="col-1 d-flex align-items-center justify-content-end me-0 pe-0">
            <div
              className=""
              role="button"
              style={{ fontSize: "12px" }}
              onClick={() => setEnableEditing(true)}
            >
              Edit
              <IconContext.Provider
                value={{
                  color: "#000",
                  size: "10px",
                  className: "global-class-name",
                }}
              >
                <FiEdit2 className="ms-1 mb-1" />
              </IconContext.Provider>
            </div>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-3 mb-2">
            <label
              for="basic-url"
              className="form-label"
              style={{ fontSize: "12px" }}
            >
              First Name
            </label>
            <input
              type="text"
              disabled={!enableEditing}
              className={`form-control ${enableEditing ? "bg-white" : ""}`}
              placeholder="First Name"
            />
          </div>
          <div className="col-3 mb-2">
            <label
              for="basic-url"
              className="form-label"
              style={{ fontSize: "12px" }}
            >
              Middle Name
            </label>
            <input
              type="text"
              disabled={!enableEditing}
              className={`form-control ${enableEditing ? "bg-white" : ""}`}
              placeholder="Middle Name"
            />
          </div>
          <div className="col-3 mb-2">
            <label
              for="basic-url"
              className="form-label"
              style={{ fontSize: "12px" }}
            >
              Last Name
            </label>
            <input
              type="text"
              disabled={!enableEditing}
              className={`form-control ${enableEditing ? "bg-white" : ""}`}
              placeholder="Last Name"
            />
          </div>
          <div className="col-3 mb-2">
            <label
              for="basic-url"
              className="form-label"
              style={{
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Company Name</span>{" "}
              {overLayTooltip(
                <div>
                  <div>To Add/Modify</div>
                  <div>admin@bf.com</div>
                </div>
              )}
            </label>

            <input
              type="text"
              disabled={!enableEditing}
              className={`form-control ${enableEditing ? "bg-white" : ""}`}
              placeholder=" Company Name"
            />
          </div>
          <div className="col-3">
            <label
              for="basic-url"
              className="form-label"
              style={{ fontSize: "12px" }}
            >
              Role
            </label>
            <input
              type="text"
              disabled={!enableEditing}
              className={`form-control ${enableEditing ? "bg-white" : ""}`}
              placeholder="Role"
            />
          </div>
          <div className="col-3">
            <label
              for="basic-url"
              className="form-label"
              style={{ fontSize: "12px" }}
            >
              Level of Access
            </label>
            <input
              type="text"
              disabled={!enableEditing}
              className={`form-control ${enableEditing ? "bg-white" : ""}`}
              placeholder="Level of Access"
            />
          </div>
          <div className="col-6">
            <label
              for="basic-url"
              className="form-label"
              style={{ fontSize: "12px" }}
            >
              Locations
            </label>
            <input
              type="text"
              disabled={!enableEditing}
              className={`form-control ${enableEditing ? "bg-white" : ""}`}
              placeholder="Locations"
            />
          </div>
        </div>
      </div>

      <div className="container py-3 px-4">
        <div className="row w-100 justify-content-between">
          <div className="col d-flex align-items-center">
            <h4>Personal</h4>
            <hr className="postTitleLine ms-3" />
          </div>
          <div className="col-1 me-0 pe-0"></div>
        </div>

        <div className="row py-3">
          <div className="col-3 mb-2">
            <label
              for="basic-url"
              className="form-label d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              <div>Email Address</div>
              <div
                onClick={() => {
                  setOpen(true);
                }}
                className=""
                role="button"
                style={{ fontSize: "12px" }}
              >
                Edit
                <IconContext.Provider
                  value={{
                    color: "#000",
                    size: "10px",
                    className: "global-class-name",
                  }}
                >
                  <FiEdit2 className="ms-1 mb-1" />
                </IconContext.Provider>
              </div>
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
            />
          </div>
          <div className="col-3 mb-2">
            <label
              for="basic-url"
              className="form-label d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              <div>Mobile Number</div>
              <div onClick={() => {
                  setOpenMobile(true);
                }} className="" role="button" style={{ fontSize: "12px" }}>
                Edit
                <IconContext.Provider
                  value={{
                    color: "#000",
                    size: "10px",
                    className: "global-class-name",
                  }}
                >
                  <FiEdit2 className="ms-1 mb-1" />
                </IconContext.Provider>
              </div>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Mobile Number"
            />
          </div>
          <div className="col-3 mb-2">
            <label
              for="basic-url"
              className="form-label d-flex justify-content-between"
              style={{ fontSize: "12px" }}
            >
              <div>Password</div>
              <div className="" role="button" style={{ fontSize: "12px" }}>
                Edit
                <IconContext.Provider
                  value={{
                    color: "#000",
                    size: "10px",
                    className: "global-class-name",
                  }}
                >
                  <FiEdit2 className="ms-1 mb-1" />
                </IconContext.Provider>
              </div>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>
        </div>
      </div>

      <div className="container py-3 px-4">
        <div className="row w-100 justify-content-between">
          <div className="col d-flex align-items-center">
            <h4>Settings</h4>
            <hr className="postTitleLine ms-3" />
          </div>
          <div className="col-1 me-0 pe-0"></div>
        </div>

        <div className="row py-3 d-flex align-items-center">
          <div className="col-3">
            <div className="form-check form-switch d-flex justify-content-between ps-0 pe-5">
              <span className="mr-2">Email Notification</span>
              <input
                role="button"
                className="form-check-input form-control"
                type="checkbox"
                id="emailNotificationSwitch"
              />
            </div>
          </div>
          <div className="col-3 ">
            <div className="form-check form-switch d-flex justify-content-between ps-0 pe-5">
              <span className="mr-2">SMS Notification</span>
              <input
                role="button"
                className="form-check-input form-control "
                type="checkbox"
                id="smsNotificationSwitch"
              />
            </div>
          </div>
          <div className="col-3 mb-2 d-flex justify-content-between ps-0 align-items-center">
            <span className="me-3">Timezone</span>
            <div class="dropdown w-100">
              <div
                class="btn btn-default border-1 rounded-0 border-dark dropdown-toggle w-100 d-flex justify-content-between align-items-center"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Timezone
              </div>

              <ul
                class="dropdown-menu w-100"
                aria-labelledby="dropdownMenuLink"
              >
                <li>
                  <a class="dropdown-item" href="#">
                    Option 1
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Option 2
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Option 3
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row w-50 ms-auto me-auto py-3 d-flex justify-content-center align-items-center">
          <button
            className="btn btn-dark w-25"
            disabled={!enableEditing}
            onClick={() => setEnableEditing(false)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
