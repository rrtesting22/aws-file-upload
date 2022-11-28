import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { upload } from "./handlers";
jest.mock("@aws-sdk/client-s3");

import FormData from "form-data";
import fs from "fs";

describe("upload", () => {
  const file = fs.readFileSync("./example.jpeg");
  const form = new FormData();
  form.append("file", file, { filename: "example.jpeg" });

  const event = {
    headers: {
      ...form.getHeaders(),
    },
    body: form.getBuffer().toString("base64"),
  };

  afterAll(() => {
    (S3Client as jest.Mock).mockClear();
    (PutObjectCommand as unknown as jest.Mock).mockClear();
  });

  it("returns an id and upload a file to s3", async () => {
    const mockSend = jest.fn();
    (S3Client as jest.Mock).mockImplementation(() => {
      return {
        send: mockSend,
      };
    });

    const mockPutObjectCommand = jest.fn();
    (PutObjectCommand as unknown as jest.Mock).mockImplementation(
      () => mockPutObjectCommand
    );

    const response = await upload(event);

    expect(S3Client).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(PutObjectCommand).toHaveBeenCalledTimes(1);
    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: "example-bucket-file-upload",
        Key: expect.any(String),
        Body: expect.any(Object),
      })
    );

    expect(JSON.parse(response.body)).toEqual({
      id: expect.any(String),
    });
    expect(response.statusCode).toEqual(200);
  });
});
