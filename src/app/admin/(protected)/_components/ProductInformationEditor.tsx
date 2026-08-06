"use client";

import { useState } from "react";
import { MeasurementsEditor } from "./MeasurementsEditor";
import { saveProductInformationAction } from "@/actions/admin/products";
import type { SizeChartMeasurements } from "@/lib/admin/types";

const input =
  "mt-1 min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#9c5247]";

interface ProductInformationEditorProps {
  info: any;
  productId: string;
}

export function ProductInformationEditor({
  info,
  productId,
}: ProductInformationEditorProps) {
  const [measurements, setMeasurements] = useState<SizeChartMeasurements | null | undefined>(
    info?.measurements
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (measurements) {
      const form = e.currentTarget;
      const measurementsInput = form.querySelector(
        'input[name="measurements"]'
      ) as HTMLInputElement;
      if (measurementsInput) {
        measurementsInput.value = JSON.stringify(measurements);
      }
    }
  };

  return (
    <form
      action={saveProductInformationAction}
      onSubmit={handleFormSubmit}
      className="mt-5 space-y-5"
    >
      <input type="hidden" name="productId" value={productId} />
      <input
        type="hidden"
        name="measurements"
        value={measurements ? JSON.stringify(measurements) : ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["fabric", "Fabric", info?.fabric],
          ["fit", "Fit", info?.fit],
          ["care", "Care instructions", info?.care],
          ["shipping", "Shipping note", info?.shipping],
        ].map(([name, label, value]) => (
          <label key={String(name)} className="text-sm font-medium text-stone-700">
            {label}
            <textarea
              name={String(name)}
              defaultValue={String(value ?? "")}
              className={`${input} min-h-20 py-2`}
            />
          </label>
        ))}
      </div>

      <label className="block text-sm font-medium text-stone-700">
        Additional details
        <textarea
          name="details"
          defaultValue={info?.details || ""}
          className={`${input} min-h-24 py-2`}
        />
      </label>

      <MeasurementsEditor value={measurements} onChange={setMeasurements} />

      <div className="border-t border-stone-100 pt-5 text-right">
        <button className="min-h-10 rounded-lg bg-[#9c5247] px-4 text-sm font-semibold text-white hover:bg-[#7e3f35]">
          Save product information
        </button>
      </div>
    </form>
  );
}
