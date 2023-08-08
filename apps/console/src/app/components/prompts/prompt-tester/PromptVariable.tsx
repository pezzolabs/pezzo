import { ExpandAltOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Form, Input, Popover } from "antd";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  name: string;
  value: string;
}

export const PromptVariable = ({ name, value }: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef();

  useOnClickOutside(popoverRef, (e) => {
    const target = e.target as HTMLElement;
    const closest = target.closest(".ant-popover");
    if (closest === null) {
      setIsPopoverOpen(false);
    }
  });

  return (
    <div ref={popoverRef}>
      <Popover
        title={name}
        open={isPopoverOpen}
        content={
          <div style={{ minWidth: 400 }}>
            <Form.Item name={name}>
              <Input.TextArea
                value={value}
                style={{ height: 150, fontFamily: "Roboto Mono" }}
              />
            </Form.Item>
          </div>
        }
      >
        <Form.Item name={name}>
          <Input
            addonBefore={`${name}`}
            value={value}
            className={css`
              .ant-input {
                font-family: "Roboto Mono";
              }
            `}
            addonAfter={
              <ExpandAltOutlined onClick={() => setIsPopoverOpen(true)} />
            }
          />
        </Form.Item>
      </Popover>
    </div>
  );
};
