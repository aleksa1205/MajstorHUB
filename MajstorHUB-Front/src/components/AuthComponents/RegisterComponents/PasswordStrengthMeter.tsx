function passwordScore(password: string): number {
  if(password == null) return 0;
  let score: number = 0;
  const regex = /[!@#$%^&*()-+]/;

  let hasNumber: boolean = false;
  let hasLower: boolean = false;
  let hasUpper: boolean = false;
  let hasSpecial: boolean = false;
  let isLong: boolean = password.length >= 8;

  for (const c of password) {
    if (!hasNumber) hasNumber = c >= "0" && c <= "9";
    if (!hasLower) hasLower = c >= "a" && c <= "z";
    if (!hasUpper) hasUpper = c >= "A" && c <= "Z";
    if (!hasSpecial) hasSpecial = regex.test(c);
  }

  if (!isLong) return 0;
  hasNumber ? score++ : null;
  hasLower ? score++ : null;
  hasUpper ? score++ : null;
  hasSpecial ? score++ : null;

  return score;
}

type propsType = {
  password: string;
};

const PasswordStrengthMeter = ({ password }: propsType) => {
  //   const testResult = zxcvbn(password);
  //   const num = testResult.score * 100/4;
  const score = passwordScore(password);
  const num = (score * 100) / 4;

  const createPassLabel = () => {
    switch (score) {
      case 0:
        return "Very weak";
      case 1:
        return "Weak";
      case 2:
        return "Fear";
      case 3:
        return "Good";
      case 4:
        return "Strong";
    //   case 5:
    //     return "Giga Strong";
      default:
        return "";
    }
  };

  const funcProgressColor = () => {
    switch (score) {
      case 0:
        return "#505b74";
      case 1:
        return "#e5212c";
      case 2:
        return "#e8e009";
      case 3:
        return "#04ab48";
      case 4:
        return "#0dd75f";
    //   case 5:
    //     return "#123234";
      default:
        return "none";
    }
  };

  const changePasswordColor = () => ({
    width: num == 0 ? `10px` : `${num}%`,
    marginTop: '0.5rem',
    background: funcProgressColor(),
    height: "7px",
    borderRadius: "10px",
    transition: "width 0.4s ease-in-out"
  });

  return (
    <>
      <div className="progress" style={{ height: "7px" }}>
        <div className="progress-bar" style={changePasswordColor()}></div>
      </div>
      <p style={{ color: funcProgressColor() }}>{createPassLabel()}</p>
    </>
  );
};

export default PasswordStrengthMeter;
