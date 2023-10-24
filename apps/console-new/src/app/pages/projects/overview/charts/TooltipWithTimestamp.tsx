import moment from "moment";
import { DefaultTooltipContent } from "recharts";

export const TooltipWithTimestamp = (props) => {
  // payload[0] doesn't exist when tooltip isn't visible
  if (props.payload[0] != null) {
    // mutating props directly is against react's conventions
    // so we create a new payload with the name and value fields set to what we want
    const newPayload = [
      {
        name: "timestamp",
        // all your data which created the tooltip is located in the .payload property
        value: moment(props.payload[0].payload.timestamp).format(
          "YYYY-MM-DD HH:mm"
        ),
        // you can also add "unit" here if you need it
      },
      ...props.payload,
    ];

    // we render the default, but with our overridden payload
    return <DefaultTooltipContent {...props} payload={newPayload} />;
  }

  // we just render the default
  return <DefaultTooltipContent {...props} />;
};
