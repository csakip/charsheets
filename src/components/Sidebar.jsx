import { Dropdown, Nav, OverlayTrigger, Tooltip, NavItem, NavLink } from "react-bootstrap";
import {
  Calendar3,
  EnvelopeFill,
  BoxArrowRight,
  House,
  PeopleFill,
  PencilSquare,
  Eyeglasses,
  Columns,
} from "react-bootstrap-icons";
import { signOut } from "../supabaseClient";
import React, { useState } from "react";
import { useSimpleDialog } from "./SimpleDialog";
import csStore from "../store";
import { useStore } from "zustand";

const Sidebar = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const mode = useStore(csStore, (state) => state.mode);

  const { openModal, SimpleDialog } = useSimpleDialog();
  const renderTooltip = (props, content) => (
    <Tooltip id={`tooltip-${content}`} {...props}>
      {content}
    </Tooltip>
  );

  function SidebarItem({ icon, tooltip, hasContextMenu, onClick }) {
    const wrappedContent = (
      <OverlayTrigger
        placement='right'
        delay={{ show: 500, hide: 100 }}
        overlay={(props) => renderTooltip(props, tooltip)}>
        {React.cloneElement(icon, { size: 20 })}
      </OverlayTrigger>
    );

    if (hasContextMenu) {
      return (
        <Dropdown as={NavItem} drop='end'>
          <Dropdown.Toggle as={NavLink}>{wrappedContent}</Dropdown.Toggle>
          <Dropdown.Menu style={{ marginLeft: "-10px" }}>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
            <Dropdown.Item>Option 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <Nav.Item>
        <Nav.Link onClick={onClick}>{wrappedContent}</Nav.Link>
      </Nav.Item>
    );
  }

  const modes = {
    content: { label: "Content", icon: <PencilSquare />, next: "layout" },
    layout: { label: "Layout", icon: <Columns />, next: "view" },
    view: { label: "View", icon: <Eyeglasses />, next: "content" },
  };

  return (
    <>
      <div className='position-relative'>
        <Nav className='flex-column sidebar text-center' style={{ width: 75 }}>
          <SidebarItem
            icon={modes[mode].icon}
            tooltip='Change mode'
            onClick={() => csStore.setState({ mode: modes[mode].next })}
          />
          <Nav.Item>
            <Nav.Link
              eventKey='link-2'
              className='text-small'
              onClick={() => csStore.setState({ mode: modes[mode].next })}
              style={{ marginTop: -20 }}>
              <small>{modes[mode].label}</small>
            </Nav.Link>
          </Nav.Item>
          <SidebarItem
            icon={<House />}
            tooltip='Home'
            onClick={() => setSubmenuOpen(!submenuOpen)}
          />
          <SidebarItem icon={<EnvelopeFill />} tooltip='Messages' hasContextMenu={true} />
          <SidebarItem icon={<PeopleFill />} tooltip='Users' />
          <SidebarItem icon={<Calendar3 />} tooltip='Calendar' hasContextMenu={true} />
          <SidebarItem
            icon={<BoxArrowRight />}
            tooltip='Log out'
            onClick={() => {
              openModal({
                title: "Log out",
                body: "Are you sure you want to log out?",
                cancelButton: "Cancel",
                cancelButtonVariant: "dark",
                onClose: (ret) => {
                  if (ret) signOut();
                },
              });
            }}
          />
        </Nav>
        <div className={`sidebar-submenu ${submenuOpen ? "open" : ""}`}>
          <small>Text</small>
        </div>
      </div>
      <SimpleDialog />
    </>
  );
};

export default Sidebar;
