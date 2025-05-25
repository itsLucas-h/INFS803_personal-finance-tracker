export const uploadFileToS3 = async (file: File) => {
  // Step 1: Get a presigned URL from backend
  const presignRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/view?key=temp-key`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const { url } = await presignRes.json();

  // Step 2: Upload the file directly to S3
  const uploadRes = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadRes.ok) {
    throw new Error("S3 upload failed");
  }
};
