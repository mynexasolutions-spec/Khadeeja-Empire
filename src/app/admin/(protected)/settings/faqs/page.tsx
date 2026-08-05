import { saveFaqAction, deleteFaqAction } from "@/actions/admin/content";
import { getDataProvider } from "@/lib/data";
import { PageHeading } from "../../_components/AdminPage";
import { ManagedCollection, type ServerFormAction } from "../../_components/ManagedCollection";
export const dynamic = "force-dynamic";
export default async function FaqsPage() { const records = await getDataProvider().listFaqs(); return <div><PageHeading title="Global FAQs" description="Manage frequently asked questions available to storefront visitors."/><ManagedCollection records={records as unknown as Array<Record<string, unknown>>} saveAction={saveFaqAction as unknown as ServerFormAction} deleteAction={deleteFaqAction as unknown as ServerFormAction} emptyTitle="No FAQs" createLabel="Add FAQ" fields={[{name:"question",label:"Question",required:true},{name:"category",label:"Category"},{name:"answer",label:"Answer",type:"textarea",required:true},{name:"sortOrder",label:"Sort order",type:"number",min:0},{name:"active",label:"Active",type:"checkbox"}]} summary={(r)=>({title:String(r.question),detail:String(r.category||"General"),status:Boolean(r.active)})}/></div>; }
