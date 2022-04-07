import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const Form = () => {
  const [numberOfItems, setNumberOfItems] = useState(0),
    items = ["item1", "item2", "item3"],
    { register, control, handleSubmit, reset, formState } = useForm(),
    { fields, append, remove } = useFieldArray({
      name: "items",
      control,
    }),
    { errors } = formState;

  useEffect(() => {
    // Update field array when numberOfItems changes
    const newVal = parseInt(numberOfItems || 0),
      oldVal = fields.length || 0;
    if (newVal > oldVal) {
      // Append to field array
      for (let i = oldVal; i < newVal; i++) {
        append({
          item: "",
          quantity: null,
        });
      }
    } else {
      // Remove from field array
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfItems]);

  const onSubmit = (formData) => {
    for (let i = 0; i < numberOfItems; i++) {
      formData.items[i].quantity = parseInt(formData.items[i].quantity);
    }
    console.log(formData);
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button
          type="button"
          onClick={() => {
            setNumberOfItems(numberOfItems + 1);
          }}
        >
          Add Items +
        </button>
        {fields.map((item, i) => {
          return (
            <div key={i}>
              <div>
                <label>Item</label>
                <select
                  placeholder="Please select"
                  name={`items[${i}]item`}
                  {...register(`items.${i}.item`, { required: true })}
                >
                  {items.map((item) => {
                    return <option value={item}>{item}</option>;
                  })}
                </select>
                <div>{errors.items?.[i]?.item?.message}</div>
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Please enter quantity"
                  name={`items[${i}]quantity`}
                  {...register(`items.${i}.quantity`, { min: 1, max: 9 })}
                />
              </div>
              <div>{errors.items?.[i]?.quantity?.message}</div>
            </div>
          );
        })}
        <div>
          <button
            type="button"
            onClick={() => {
              setNumberOfItems(numberOfItems - 1);
            }}
          >
            Remove item
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Form;
