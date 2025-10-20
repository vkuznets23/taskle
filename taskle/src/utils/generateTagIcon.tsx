import { MdOutlineWork } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa6'
import { FaBook } from 'react-icons/fa'
import { type Tag } from '../components/dashboard'

export default function generateTagIcon(tag: Tag) {
  if (tag === 'PERSONAL') return <FaHeart />
  else if (tag === 'STUDYING') return <FaBook />
  else if (tag === 'WORK') return <MdOutlineWork />
  else return null
}
