import os from "os";

const architecture = () => console.log(os.arch());

const cpu = () => {
  const cpus = os.cpus();

  const info = cpus.map((cpu, index) => ({
    cpu: `CPU ${index}`,
    model: cpu.model,
    speed: `${(cpu.speed / 1000).toFixed(2)} GHz`,
  }));

  console.table(info);
};

const eol = () => console.log(JSON.stringify(os.EOL));

const homedir = () => console.log(os.homedir());

const username = () => console.log(os.userInfo().username);

export { architecture, cpu, eol, homedir, username };
