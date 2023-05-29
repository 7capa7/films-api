import { Character } from "../entity/Character";

export async function checkIfCharacterExist(characterData: string) {
  const repository = Character.getRepository();
  const character = await repository.findOne({
    where: { name: characterData },
  });
  return character != null;
}

export async function createCharacter(characterData: string) {
  const character = Character.create({ name: characterData });
  return await character.save();
}

export async function getCharacter(characterData: string) {
  const repository = Character.getRepository();
  const character = await repository.findOne({
    where: { name: characterData },
  });
  return character;
}
