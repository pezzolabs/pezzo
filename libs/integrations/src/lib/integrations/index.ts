export * from "./openai";

export interface IntegrationDefinition {
  id: string;
  name: string;
  provider: string;
  iconBase64: string;
}

export const integrationsList: IntegrationDefinition[] = [
  {
    id: "ai21",
    name: "AI21 Instruct",
    provider: "AI21",
    iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAfhQTFRF////xMTEgoKCf39/rKysh4eHw8PD/f39wsLCdnZ2MjIyDw8PAQEBAAAABQUFJSUlT09PoKCg5+fn7u7uj4+Px8fHWVlZOTk58vLy4+PjiYmJIyMjAwMDEhISPDw8vLy8/v7+19fXGBgYDQ0NCwsLvr6+1tbWLS0tBAQEg4OD9vb2tra2BwcHubm5bW1tVFRU+/v7X19fBgYGiIiIPz8/HR0dQUFB9fX18/PzQ0ND9/f3ExMTnZ2d6OjoKSkpHBwcxcXFCAgIERER0NDQo6OjRUVFLy8vn5+fS0tLCgoKqKio7OzsOzs77+/va2tre3t7z8/PEBAQqampt7e3SkpKXl5ed3d3CQkJ5eXlv7+/ICAgoaGhp6en+Pj4RkZGJCQkyMjIvb29zs7OV1dXhYWF+fn5wMDAPT09jo6ONDQ08fHx+vr6np6eGRkZ9PT0zMzMFBQUwcHBq6urLi4utLS0bm5udHR05OTkdXV1YmJiYWFhNjY24uLirq6uFhYWJiYmlJSUJycn09PT8PDwMDAw/Pz8ampqcnJymJiYAgICaWlpioqKSUlJW1tboqKi6urqFxcXlZWVpqamR0dHHh4e1NTUFRUV39/fKioq6enpTk5OU1NTurq6GxsbgICAcXFxk5OTzc3NgYGBb29vmZmZeXl5u7u729vbhc2l6AAAArpJREFUeJztlOlfEkEYxzdJ0WASAc1UagtNSi0UI8gOqTTxyrRULDqsNZXCsOy0LBLLbu2+Dzv+zXae2V122QN93fzezDO/53m+O7Mzn2EYKioqKioqqv9Hq3JMvFanjVw8N+Xh0JxfsMZiRWsLbUX2dIHDiQuK9YAlVsRrXalkWPAc5fLR+rLyCkTk2rCRFQs2bcaOU4dX6oaGyio1cEu1B6Vl2bpNKKipNQLWCfXb1cAdSCGL8E2vDRkB64XyBnsm0EcSnurGnSTy7+KzgbwgMgLubhIXsCcDuHcfjPubWcZbH8LhgYOHWlprxXod4GFpR20ZwOIwjO3Y6vDj0Fpkkv0BbWCgUyoIdSmB7cQOgNcN8ZHswJ6jsBeo6FUC+xqxjhHvOHj92YE5ODVQBrtrG1QA5WWRIfBOnLRhGQCjp3Dq9BnYeNNZPWCHHy6kazhgxzIADsMZn/Oeh5JuVhPIjVwgiJIoMQyAo5AaZSIwjo1rAWMXLxGCu47JBozDAt0TDHcZzjmhAZy8IhxCeJLNCrwKmVYHw0xBdE0FvH5DPNTKXqlNH3gTMrf4L48M4Oj2tBLITnQKr40neIfNDjTfJZeBDwdnYBX3lMBmcbsNUw5Zny4wAYn7SbwWcrmCCuCDcoE3m0wxywAG5iDxEJ65RxDP2+XAx6TT9YRTNuoBewoh8RRe/GfwbqPnMuCLlxBYFqLM8oA+pFZLGsiSA65Y9GY26gBjrzSA4S4JOD4G42uzaiU6wDdvNYCoQAIm4bKjIVNa7wyBC1o89P6DCKyaVyUjRsD4R7Ijp6hPMA99FoGL6q8ZAmu+gP1VMvJJ3TcR+H2FwDm4J5YfksHB441mHQLQuULgzyUsXzzt/AKnf/o3jH/6llT6SwrJJJEB5EAxmeMlljCYU5xKKXmr+jpRUVFRUVFRUWXTP5GOsGdzVyt9AAAAAElFTkSuQmCC"
  }
];