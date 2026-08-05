"use server";

import { subscriberMutationSchema } from "@/lib/admin/schemas";
import { getDataProvider } from "@/lib/data";
import { adminMutation, finishFormAction, inputObject, noData, parseId } from "./common";

const paths = ["/admin", "/admin/subscribers"];

async function saveSubscriberMutation(input: unknown) {
  return adminMutation(async () => {
    const value = subscriberMutationSchema.parse(inputObject(input, { nullable: ["name", "source"] }));
    return getDataProvider().createSubscriber(value);
  }, paths);
}

async function deleteSubscriberMutation(id: string) {
  return noData(await adminMutation(async () => getDataProvider().deleteSubscriber(parseId(id)), paths));
}

export async function saveSubscriberAction(formData: FormData): Promise<void> {
  await finishFormAction(saveSubscriberMutation(formData));
}

export async function deleteSubscriberAction(formData: FormData): Promise<void> {
  await finishFormAction(deleteSubscriberMutation(String(formData.get("id") ?? "")));
}
