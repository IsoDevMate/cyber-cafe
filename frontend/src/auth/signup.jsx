import React from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";

export const SignUpForm = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <>
    <Button onClick={handleOpen}>Sign In</Button>
    <Dialog size="xs" open={open} handler={handleOpen} className="bg-transparent shadow-none">
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardHeader>
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
            Enter your details to create a new account.
          </Typography>
          <Typography className="-mb-2" variant="h6">
            Your Name
          </Typography>
          <Input label="Full Name" size="lg" />
          <Typography className="-mb-2" variant="h6">
            Your Email
          </Typography>
          <Input label="Email" size="lg" />
          <Typography className="-mb-2" variant="h6">
            Your Password
          </Typography>
          <Input label="Password" size="lg" />
          <Typography className="-mb-2" variant="h6">
            Confirm Password
          </Typography>
          <Input label="Confirm Password" size="lg" />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleOpen} fullWidth>
            Sign Up
          </Button>
          <Typography variant="small" className="mt-4 flex justify-center">
            Already have an account?
            <Typography
              as="a"
              href="#signin"
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold"
              onClick={handleOpen}
            >
              Sign in
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </Dialog>
    </>
  );
}