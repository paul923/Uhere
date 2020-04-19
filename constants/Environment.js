import Constants from "expo-constants";

const { manifest } = Constants;

export const backend_staging = "ec2-34-212-94-48.us-west-2.compute.amazonaws.com";
export const backend_localhost = manifest.debuggerHost.split(':').shift();
