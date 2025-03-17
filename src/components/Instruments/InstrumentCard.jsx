import { Link } from "react-router"

const InstrumentCard = ({
  name,
  image,
  description,
  buttonText,
  instrumentURL,
  isDisabled,
}) => {
  return (
    <div className="card card-border border-info bg-base-100 w-96 shadow-sm">
      <figure>
        <img src={image} alt={name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-xl">{name}</h2>
        <p className="text-lg">{description}</p>
        <div className="card-actions justify-end">
          <Link
            className="btn btn-primary text-lg"
            disabled={isDisabled}
            to={instrumentURL}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InstrumentCard
