import { ExpandAltOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Input, Popover } from "antd";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export const PromptVariable = ({ name, value, onChange }: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef();

  useOnClickOutside(popoverRef, (e) => {
    const target = e.target as HTMLElement;
    const closest = target.closest(".ant-popover");
    if (closest === null) {
      setIsPopoverOpen(false);
    }
  });

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div ref={popoverRef}>
      <Popover
        title={name}
        open={isPopoverOpen}
        content={
          <div style={{ width: 300 }}>
            <Input.TextArea
              onChange={handleChange}
              value={value}
              style={{ height: 150, fontFamily: "Roboto Mono" }}
            />
          </div>
        }
      >
        <Input
          addonBefore={`${name}`}
          value={value}
          onChange={handleChange}
          className={css`
            .ant-input {
              font-family: "Roboto Mono";
            }
          `}
          addonAfter={
            <ExpandAltOutlined onClick={() => setIsPopoverOpen(true)} />
          }
        />
      </Popover>
    </div>
  );
};
