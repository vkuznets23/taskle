import { MdOutlineWork } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa6'
import { FaBook } from 'react-icons/fa'
import { type Tag } from '../types/taskTypes'

export default function generateTagIcon(tag: Tag) {
  if (tag === 'PERSONAL')
    return (
      <div className="tag-icon">
        Personal <FaHeart />
      </div>
    )
  else if (tag === 'STUDYING')
    return (
      <div className="tag-icon">
        Studying <FaBook />
      </div>
    )
  else if (tag === 'WORK')
    return (
      <div className="tag-icon">
        Work <MdOutlineWork />
      </div>
    )
  else return <div className="tag-icon">None</div>
}
