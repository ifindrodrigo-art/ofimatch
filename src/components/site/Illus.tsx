import type { IconName } from "./Icons";
import { Icon } from "./Icons";

/** Panel del trabajo: foto real si existe; si no, ilustración del oficio sobre trama punteada. */
export default function Illus({
  icon,
  tint,
  pattern = "",
  chip,
  photo,
  photoAlt = "",
  children,
}: {
  icon: IconName;
  tint: string;
  pattern?: "" | "grid" | "stripes";
  chip?: string | null;
  photo?: string | null;
  photoAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`illus ${photo ? "has-photo" : pattern}`} style={{ ["--t" as string]: tint }}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="photo" src={photo} alt={photoAlt} loading="lazy" decoding="async" />
      ) : (
        <span className="disc">
          <Icon name={icon} />
        </span>
      )}
      {chip ? <span className="chip">{chip}</span> : null}
      {children}
    </div>
  );
}
