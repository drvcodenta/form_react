import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

let renderCount = 0;

type FormValues ={
  username: string
  email: string
  channel: string
  social: {
    X: string,
    facebook: string,
  }
  phoneNumber: string[],
  phNumber: {number: string}[],
  age: number,
  dob: Date,
}

export const YoutubeForm = () => {
  const Form = useForm<FormValues>({
    defaultValues: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await response.json()
      return{
        username: "UserName Sample",
        email: data.email,
        channel: "Channel Sample",
        social: {
          X: "",
          facebook: "",
        },
        phoneNumber: ["",""],
        phNumber: [{ number: ""}],
        age: 0,
        dob: new Date(),
      }
      mode: "onSubmit"
      // mode: "onBlur"
      // mode: "onTouched" //These four are another type of modes working differently
      // mode: "onChange"
      // mode: "all"
    }
  }); //useForm() is a hook that returns an object which contains various methods that can be used in a form
  const { register,control, handleSubmit, formState, watch,getValues, setValue, reset } = Form; //Calls the hook state property which holds all the state properties like ref,onChange,onBlur and tracks the form state
  const { errors,isDirty,isValid,isSubmitSuccessful } = formState;
// isSubmitting,isSubmitted are useful bricks!
  // const watchForm   = watch();


  const { fields,append,remove } = useFieldArray({
    name: 'phNumber',
    control
  })

  renderCount++
  // renderCount/2 is done because strictMode renders the Page twice, so it's divided by 2

  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted', data)
  };

  const handleGetValues = () => {
    console.log("Get Values", getValues());
  }

  const handleSubmissionError = (errors: FieldErrors<FormValues>) => {
    console.log("Form Errors",errors);
  }

  const handleSetValues = () => {
    setValue("username","");
  }

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value)
    });
    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    if(isSubmitSuccessful){
      reset()
    }
  }, [isSubmitSuccessful, reset])

  return (
    <div>
      <h1>YouTube Form ({renderCount/2})</h1> 
      {/* <h2>Watched Value: {JSON.stringify(watchForm)}</h2> */}
      <form onSubmit={handleSubmit(onSubmit, handleSubmissionError)} noValidate>
        <div className="form-control">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" {...register("username", {required:{value: true,message: "Username is Required"}})} />
        <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register("email", {pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid Email Format'
        },
        validate: {
          notAdmin: (fieldValue) => {
            return(
              fieldValue != "admin@example.com" || "Enter a different email address"
            );
          },
          notBlacklist: (fieldValue) => {
            return !fieldValue.endsWith("baddomain.com") || "This domain is not Supported!"
          }
        }
        })} />
        <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
        <label htmlFor="channel">Channel</label>
        <input type="text" id="channel" {...register("channel", {required:{value: true,message: "Channel is Required"}})} />
        <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
        <label htmlFor="X">X</label>
        <input type="text" id="X" {...register("social.X", {required:{value: false,message: "Twitter Account Id  is Required"}, disabled: true})} />
        </div>

        <div className="form-control">
        <label htmlFor="facebook">Facebook</label>
        <input type="text" id="facebook" {...register("social.facebook", {required:{value: false,message: "faceBook Account Id  is Required"}})} />
        </div>

        {/* <div className="form-control">
        <label htmlFor="">primary-phoneNumber</label>
        <input type="text" id="primary-phoneNumber" {...register("phoneNumber.0", {required:{value: false,message: "Primary phone Number is Required"}})} />
        </div>
        
        <div className="form-control">
        <label htmlFor="">secondary-phoneNumber</label>
        <input type="text" id="secondary-phoneNumber" {...register("phoneNumber.0", {required:{value: false,message: "Secondary phone Number is Required"}})} />
        </div> */}

        <div>
          <label>List of Phone Numbers</label>
          <div>
            {
              fields.map((field,index) => {
                return (<div className="form-control" key={field.id}>
                  <input type="text" {...register(`phNumber.${index}.number` as const)} />
                  {
                    index > 0 && (
                      <button type="button" onClick={() => remove(index)}>
                        Remove
                      </button>
                    )
                  }
                </div>)
              })
            }

          
            <button type="button" onClick={() => append({ number: ""})} >
              Add Phone Number
            </button>

          </div>
        </div>

        <div className="form-control">
        <label htmlFor="age">Age</label>
        <input type="number" id="age" {...register("age", {valueAsNumber:true, required:{value: true,message: "Age is Required"}, disabled: true})} /> 
        {/* you can also set disabled in a condition! */}
        <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
        <label htmlFor="dob">Date of Birth</label>
        <input type="Date" id="dob" {...register("age", {valueAsDate:false, required:{value: false,message: "DOB is Required"}})} />
        <p className="error">{errors.dob?.message}</p>
        </div>
 
        <button disabled={!isDirty || !isValid}>Submit</button>
        <button onClick={handleGetValues}>Get Values</button>

        <button onClick={handleSetValues}>Set to Default</button>
      </form>
      <DevTool control={control}/>
    </div>

  )
}
